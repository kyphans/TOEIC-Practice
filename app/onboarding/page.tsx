"use client";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function Onboarding() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Not signed in</div>;

  const name = user.firstName + (user.lastName ? " " + user.lastName : "");
  const email = user.emailAddresses?.[0]?.emailAddress || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    console.log('handleSubmit');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      console.log('res', res);
      if (!res.ok) throw new Error('Failed to create user');
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-4 border rounded space-y-4">
      <div>
        <label className="block mb-1">Name</label>
        <input value={name} disabled className="w-full border px-2 py-1 rounded bg-gray-100" />
      </div>
      <div>
        <label className="block mb-1">Email</label>
        <input value={email} disabled className="w-full border px-2 py-1 rounded bg-gray-100" />
      </div>
      <div>
        <label className="block mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">
        {loading ? "Submitting..." : "Submit"}
      </button>
      {success && <div className="text-green-600">User created successfully!</div>}
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
}