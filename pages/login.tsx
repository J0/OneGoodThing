import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const supabase = createClient('https://caiepwmbncezbswuubzo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhaWVwd21ibmNlemJzd3V1YnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg2ODUwMTUsImV4cCI6MTk5NDI2MTAxNX0.tc3VYtSgA7yYHc83cCRSHZF9Lth0sRrN6hf15tcXjjo')

const Login = () => (
  <div className="grid h-screen place-items-center">
  <Auth
    supabaseClient={supabase}
    appearance={{ theme: ThemeSupa }}
    providers={['google']}
  />
 </div>
)

export default Login;
