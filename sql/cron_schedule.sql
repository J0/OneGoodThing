SELECT cron.schedule('send-reminders', '0 11 * * *', 'select * from send_reminders()');