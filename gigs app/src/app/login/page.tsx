import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="max-w-sm mx-auto p-8">
      <h1 className="text-xl font-semibold mb-4">Log in</h1>
      <form
        action={async (formData) => {
          "use server";
          await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: "/dashboard",
          });
        }}
        className="flex flex-col gap-3"
      >
        <label>
          Email
          <input name="email" type="email" required className="w-full border p-2" />
        </label>
        <label>
          Password
          <input name="password" type="password" required className="w-full border p-2" />
        </label>
        <button type="submit" className="border p-2 mt-2">
          Log in
        </button>
      </form>
    </main>
  );
}
