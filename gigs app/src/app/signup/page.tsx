import { signup } from "./actions";

export default function SignupPage() {
  return (
    <main className="max-w-sm mx-auto p-8">
      <h1 className="text-xl font-semibold mb-4">Sign up</h1>
      <form action={signup} className="flex flex-col gap-3">
        <label>
          Name
          <input name="name" required className="w-full border p-2" />
        </label>
        <label>
          Email
          <input name="email" type="email" required className="w-full border p-2" />
        </label>
        <label>
          Password
          <input name="password" type="password" required minLength={8} className="w-full border p-2" />
        </label>
        <label>
          Phone (optional)
          <input name="phone" className="w-full border p-2" />
        </label>
        <fieldset className="flex gap-4">
          <legend>I am a</legend>
          <label>
            <input type="radio" name="role" value="freelancer" required /> Freelancer
          </label>
          <label>
            <input type="radio" name="role" value="client" /> Client
          </label>
        </fieldset>
        <button type="submit" className="border p-2 mt-2">
          Create account
        </button>
      </form>
    </main>
  );
}
