export default function HomepageIllustration({ className = "" }) {
  return (
    <img
      src="/assets/homepage.min.svg"
      alt=""
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}