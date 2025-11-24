import { useState } from "react";

import Modal from "./modal";
import ImageModal from "./imageModal";

import styles from "./styles.module.css";

import gallery from "../../assets/images/gallery.png";
import book from "../../assets/images/book.png";
import avatar from "../../assets/images/avatar.png";
import message from "../../assets/images/message.png";
import info from "../../assets/images/info.png";
import img1 from "../../assets/images/011.jpg";
import img2 from "../../assets/images/015.jpg";

const ButtonBar = () => {
  const [iframeUrl, setIframeUrl] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  const openIframe = (url: any) => {
    setIframeUrl(url);
  };

  const openImage = (src: any) => {
    setImageSrc(src);
  };

  const closeModal = () => {
    setIframeUrl(null);
    setImageSrc(null);
  };

  return (
    <>
      <div className={styles.buttonBar}>
        <button
          className={styles.roundButton}
          onClick={() => openIframe("https://example.com/")}
        >
          <img src={book} alt="Book" />
        </button>

        <button className={styles.roundButton} onClick={() => openImage(img2)}>
          <img src={gallery} alt="Gallery" />
        </button>

        <button className={styles.roundButton} onClick={() => openImage(img1)}>
          <img src={avatar} alt="Avatar" />
        </button>

        <button
          className={styles.roundButton}
          onClick={() => openIframe("https://example.com/")}
        >
          <img src={info} alt="Info" />
        </button>

        <button className={styles.roundButton} onClick={() => openImage(img1)}>
          <img src={message} alt="Message" />
        </button>
      </div>

      {iframeUrl && <Modal url={iframeUrl} onClose={closeModal} />}
      {imageSrc && <ImageModal src={imageSrc} onClose={closeModal} />}
    </>
  );
};

export default ButtonBar;
