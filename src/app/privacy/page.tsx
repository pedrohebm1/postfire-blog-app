import Navbar from "../components/navbar/navbar";
import "@/app/styles/termsandpolicy.css";

export default function Policy() {
  return (
    <div>
      <Navbar allowSearchbar={false} responsiveTitle={false} />
      <main className="flex flex-col gap-10 justify-center m-auto min-w-4/6 lg:w-8/12 pt-32 px-4 max-w-7xl mb-20">
        <h2>Privacy Policy</h2>

        <h3 >1. Data Collection</h3>
        <ul className="ml-15">
        <p>We collect and store user-provided information, such as:</p>
          <li>
            Name, email address, and other details provided during registration.
          </li>
          <li>
            Content posted on the platform, including comments and blog posts.
          </li>
          <li>Usage data, such as logins, page views, and interactions.</li>
        </ul>

        <h3>2. How We Use Your Information</h3>
        <ul>
          <li>To provide and improve our services.</li>
          <li>To personalize user experience.</li>
          <li>To ensure security and prevent fraudulent activities.</li>
          <li>To comply with legal obligations.</li>
        </ul>

        <h3>3. Data Sharing</h3>
        <ul>
        <p>We do not sell or share personal data with third parties except:</p>
          <li>When required by law.</li>
          <li>To protect our legal rights.</li>
          <li>With service providers that help us operate the platform.</li>
        </ul>

        <h3>4. User Rights</h3>
        <ul>
          <li>
            Users have the right to access, correct, or delete their personal
            data.
          </li>
          <li>Withdraw consent for data processing, where applicable.</li>
          <li>Request a copy of the data stored about them.</li>
        </ul>

        <h3>5. Security Measures</h3>
        <p>
          We implement security measures to protect user data but cannot
          guarantee complete security. Users should take precautions to
          safeguard their accounts.
        </p>

        <h3>6. Changes to Privacy Policy</h3>
        <p>
          We may update this policy periodically and will notify users of
          significant changes.
        </p>
      </main>
    </div>
  );
}
