import { AuthBall } from './AuthBall';
import { AuthBrand } from './AuthBrand';
import { AuthHeadline } from './AuthHeadline';
import { AuthStatsStrip } from './AuthStatsStrip';
import { AuthTagline } from './AuthTagline';

export function AuthArtPanel() {
  return (
    <section className="auth-art-bg hidden md:flex flex-col gap-5 p-12 min-h-screen">
      <div className="relative z-10 flex flex-col gap-5 h-full">
        <AuthBrand />
        <AuthHeadline />
        <AuthTagline />
        <AuthStatsStrip />
      </div>
      <AuthBall />
    </section>
  );
}
