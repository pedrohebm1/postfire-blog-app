import Navbar from "../components/navbar/navbar";
import "@/app/styles/termsandpolicy.css"

export default function Policy() {
  return (
    <div>
      <Navbar allowSearchbar={false} responsiveTitle={false} />
      <main className="flex flex-col gap-10 justify-center m-auto min-w-4/6  lg:w-8/12 pt-32 px-4 max-w-7xl mb-20">
        <h2>Terms of Use</h2>
        <h3>1. Acceptance of Terms</h3>
        <p className="ml-10">
          By creating an account and using Postfire, you agree to comply with
          these Terms of Use. If you do not agree, you must discontinue using
          the platform.
        </p>
        <h3>2. User Conduct</h3>
        <ul>
          <li>You must provide truthful information when signing up.</li>
          <li>
            You are responsible for maintaining the confidentiality of your
            login credentials.
          </li>
          <li>
            Respect other users; hate speech, harassment, or threats will not be
            tolerated.
          </li>
          <li>
            Do not post offensive, illegal content, or material that infringes
            copyrights.
          </li>
        </ul>
        <h3>3. Content Posting</h3>
        <ul>
          <li>
            Users are responsible for the content they publish and must hold the
            rights to it.
          </li>
          <li>
            The publication of spam, misleading information, or unauthorized
            advertisements is prohibited.
          </li>
          <li>
            The blog team reserves the right to remove content that violates
            these terms without prior notice.
          </li>
        </ul>
        <h3>4. Account Suspension and Termination</h3>
        <ul>
          <li>
            Violation of these terms may result in warnings, suspension, or
            account banning.
          </li>
          <li>
            The decisions made by the blog team are final and non-contestable.
          </li>
        </ul>
        <h3>5. Changes to Terms</h3>
        <p>
          We reserve the right to update these Terms of Use at any time and will
          notify users of significant changes.
        </p>
      </main>
    </div>
  );
}
