<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  interface Props {
    form: ActionData;
  }

  let { form }: Props = $props();
</script>

<h1>Login/Register</h1>
<form method="post" action="?/login" use:enhance>
  <label>
    Username
    <input name="username" />
  </label>
  <label>
    Password
    <input type="password" name="password" />
  </label>
  <button>Login</button>
  <button formaction="?/register">Register</button>
</form>
<p style="color: red">{form?.message ?? ''}</p>
