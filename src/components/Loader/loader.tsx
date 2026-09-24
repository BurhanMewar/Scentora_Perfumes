interface LoaderProps {
  text?: string;
  fullscreen?: boolean;
  size?: number;
}

export default function Loader({
  text = "Loading Scentora...",
  fullscreen = true,
  size = 56,
}: LoaderProps) {
  return (
    <div
      className={`scent-loader${fullscreen ? " scent-loader--fullscreen" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <div className="scent-loader-content">
        <div
          className="scent-loader-symbol"
          style={{ width: `${size}px`, height: `${size}px` }}
          aria-hidden="true"
        >
          <span className="scent-loader-orbit scent-loader-orbit--outer" />
          <span className="scent-loader-orbit scent-loader-orbit--inner" />
          <span className="scent-loader-mark">S</span>
          <span className="scent-loader-spark scent-loader-spark--one" />
          <span className="scent-loader-spark scent-loader-spark--two" />
        </div>
        {text ? <p className="scent-loader-title">{text}</p> : null}
        <p className="scent-loader-notes">AMBER / ROSE / OUD</p>
      </div>
    </div>
  );
}
