import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const LoginForm = () => {
  const { data, status } = useSession();

  const [hasError, setHasError] = useState<boolean>(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (!result.ok) {
      setHasError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {hasError && (
        <div style={{ color: "red", fontSize: "14px", marginBottom: "0.5rem" }}>
          Unrecognized username or password.
        </div>
      )}
      <div className="formItem">
        <label htmlFor="username">Username</label>
        <input id="username" name="username" type="text" required />
      </div>
      <div className="formItem">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  );
};
