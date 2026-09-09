'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <main style={{ maxWidth: '400px', margin: '3rem auto', padding: '0 1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}>Check your email</h1>
        <p>We sent a confirmation link to {email}. Please confirm before logging in.</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: '400px', margin: '3rem auto', padding: '0 1.5rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Sign Up</h1>
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
        />
        {error && <p style={{ color: '#c81d3b', fontSize: '0.9rem' }}>{error}</p>}
        <button type="submit" style={{
          padding: '0.75rem', background: '#000', color: '#fff',
          border: 'none', borderRadius: '6px', cursor: 'pointer'
        }}>
          Sign Up
        </button>
      </form>
      <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
        Already have an account? <a href="/login">Log in</a>
      </p>
    </main>
  );
    }
