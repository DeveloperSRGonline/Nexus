import { SignIn, SignUp } from '@clerk/clerk-react';
import styles from './AuthPage.module.scss';

const AuthPage = ({ mode }) => (
  <div className={styles.container}>
    <div className={styles.brand}>
      <span className={styles.logo}>⬡</span>
      <h1>NEXUS</h1>
    </div>
    <div className={styles.form}>
      {mode === 'sign-in' ? (
        <SignIn routing="path" path="/login" signUpUrl="/signup" />
      ) : (
        <SignUp routing="path" path="/signup" signInUrl="/login" />
      )}
    </div>
  </div>
);

export default AuthPage;