CREATE SCHEMA IF NOT EXISTS private;
CREATE TABLE IF NOT EXISTS private.keys (
    key text primary key not null,
    value text
);
REVOKE ALL ON TABLE private.keys FROM PUBLIC;


INSERT INTO private.keys (key, value) values ('MAILGUN_DOMAIN', '[PERSONAL_MAILGUN_DOMAIN]');
INSERT INTO private.keys (key, value) values ('MAILGUN_API_KEY', '[PERSONAL_MAILGUN_API_KEY]');


CREATE OR REPLACE FUNCTION public.send_email_mailgun (message JSONB)
  RETURNS json
  LANGUAGE plpgsql
  SECURITY DEFINER -- required in order to read keys in the private schema
  -- Set a secure search_path: trusted schema(s), then 'pg_temp'.
  -- SET search_path = admin, pg_temp;
  AS $$
DECLARE
  retval json;
  MAILGUN_DOMAIN text;
  MAILGUN_API_KEY text;
BEGIN
  
  SELECT value::text INTO MAILGUN_DOMAIN FROM private.keys WHERE key = 'MAILGUN_DOMAIN';
  IF NOT found THEN RAISE 'missing entry in private.keys: MAILGUN_DOMAIN'; END IF;
  SELECT value::text INTO MAILGUN_API_KEY FROM private.keys WHERE key = 'MAILGUN_API_KEY';
  IF NOT found THEN RAISE 'missing entry in private.keys: MAILGUN_API_KEY'; END IF;

  SELECT
    content INTO retval
  FROM
    http (('POST', 
      'https://api.mailgun.net/v3/' || MAILGUN_DOMAIN || '/messages', 
      ARRAY[http_header ('Authorization', 
      'Basic ' || encode(MAILGUN_API_KEY::bytea, 'base64'::text))], 
      'application/x-www-form-urlencoded', 
      'from=' || urlencode (message->>'sender') || 
      '&to=' || urlencode (message->>'recipient') || 
      CASE WHEN message->>'cc' IS NOT NULL THEN '&cc=' || urlencode(message->>'cc') ELSE '' END || 
      CASE WHEN message->>'bcc' IS NOT NULL THEN '&bcc=' || urlencode(message->>'bcc') ELSE '' END || 
      CASE WHEN message->>'messageid' IS NOT NULL THEN '&v:messageid=' || urlencode(message->>'messageid') ELSE '' END || 
      '&subject=' || urlencode(message->>'subject') || 
      '&text=' || urlencode(message->>'text_body') || 
      '&html=' || urlencode(message->>'html_body')));
      -- if the message table exists, 
      -- and the response from the mail server contains an id
      -- and the message from the mail server starts wtih 'Queued'
      -- mark this message as 'queued' in our message table, otherwise leave it as 'ready'
      IF  (SELECT to_regclass('public.messages')) IS NOT NULL AND 
          retval->'id' IS NOT NULL 
          AND substring(retval->>'message',1,6) = 'Queued' THEN
        UPDATE public.messages SET status = 'queued' WHERE id = (message->>'messageid')::UUID;
      END IF;

  RETURN retval;
END;
$$;
-- Do not allow this function to be called by public users (or called at all from the client)
REVOKE EXECUTE on function public.send_email_mailgun FROM PUBLIC;


/************************************************************
 *
 * Function:  send_email_message
 * 
 * low level function to send email message
 *
 ************************************************************/
CREATE EXTENSION IF NOT EXISTS HTTP;
-- drop function send_email_message;
CREATE OR REPLACE FUNCTION public.send_email_message (message JSONB)
  RETURNS json
  LANGUAGE plpgsql
  -- SECURITY DEFINER -- required in order to read keys in the private schema
  -- Set a secure search_path: trusted schema(s), then 'pg_temp'.
  -- SET search_path = admin, pg_temp;
  AS $$
DECLARE
  -- variable declaration
  email_provider text := 'mailgun'; -- 'mailgun', 'sendgrid', 'sendinblue', 'mailjet', 'mailersend'
  retval json;
  messageid text;
BEGIN


  IF message->'text_body' IS NULL AND message->'html_body' IS NULL THEN RAISE 'message.text_body or message.html_body is required'; END IF;
  
  IF message->'text_body' IS NULL THEN     
     select message || jsonb_build_object('text_body',message->>'html_body') into message;
  END IF;
  
  IF message->'html_body' IS NULL THEN 
     select message || jsonb_build_object('html_body',message->>'text_body') into message;
  END IF;  

  IF message->'recipient' IS NULL THEN RAISE 'message.recipient is required'; END IF;
  IF message->'sender' IS NULL THEN RAISE 'message.sender is required'; END IF;
  IF message->'subject' IS NULL THEN RAISE 'message.subject is required'; END IF;

  IF message->'messageid' IS NULL AND (SELECT to_regclass('public.messages')) IS NOT NULL THEN
    -- messages table exists, so save this message in the messages table
    INSERT INTO public.messages(recipient, sender, cc, bcc, subject, text_body, html_body, status, log)
    VALUES (message->'recipient', message->'sender', message->'cc', message->'bcc', message->'subject', message->'text_body', message->'html_body', 'ready', '[]'::jsonb) RETURNING id INTO messageid;
    select message || jsonb_build_object('messageid',messageid) into message;
  END IF;

  EXECUTE 'SELECT send_email_' || email_provider || '($1)' INTO retval USING message;
  -- SELECT send_email_mailgun(message) INTO retval;
  -- SELECT send_email_sendgrid(message) INTO retval;

  RETURN retval;
END;
$$;
-- Do not allow this function to be called by public users (or called at all from the client)
REVOKE EXECUTE on function public.send_email_message FROM PUBLIC;

-- To allow, say, authenticated users to call this function, you would use:
-- GRANT EXECUTE ON FUNCTION public.send_email_message TO authenticated;


CREATE OR REPLACE FUNCTION public.send_reminders()
  RETURNS text
  LANGUAGE plpgsql
  SECURITY DEFINER -- required in order to read keys in the private schema
  -- Set a secure search_path: trusted schema(s), then 'pg_temp'.
  -- SET search_path = admin, pg_temp;
  AS $$
DECLARE
BEGIN



  RETURN retval;
END;
$$;
-- Do not allow this function to be called by public users (or called at all from the client)
REVOKE EXECUTE on function public.send_email_message FROM PUBLIC;

create or replace function public.uid()
returns uuid
language sql stable
as $$
  select
  nullif(
    coalesce(
      current_setting('request.jwt.claim.sub', true),
      (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
    ),
    ''
  )::uuid
$$;

CREATE OR REPLACE FUNCTION send_reminders()
returns text as $$

    var emails = plv8.execute(
      'select email from auth.users left outer join public.deeds on public.deeds.id = auth.users.id and public.deeds.created_at = now()::date where deeds.created_at is null'
    );

    for (let x=0; x < emails.length; x++) {
      var message = 
          {"sender":"OneGoodThing@azabab.com",
          "recipient":emails[x].email,
          "subject": "Reminder: Do One Good Thing today!",
          "html_body": "<html><body>Don't forget to do One Good Thing today.  Visit https://one-good-thing.vercel.app to record your deed and keep your streak alive.</body></html>"
          };
      plv8.execute("select send_email_message($1)", message);     
    }

  return '';

$$ language plv8;