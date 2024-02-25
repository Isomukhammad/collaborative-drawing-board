import Konva from "konva";

import { JSX, forwardRef } from "react";

const DownloadBtn = forwardRef<Konva.Stage, {}>(({}, ref): JSX.Element => {
  const handleExport = (): void => {
    if (!ref.current) return;
    const dataUrl = ref.current.toDataURL();
    if (dataUrl) {
      const link = document.createElement("a");
      link.download = "image.png";
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <button
      type={"button"}
      onClick={handleExport}
      className={
        "custom-button absolute right-1/2 top-5 !w-fit translate-x-1/2"
      }
    >
      Download
    </button>
  );
});

export default DownloadBtn;
