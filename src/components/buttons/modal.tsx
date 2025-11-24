import styles from "./modal.module.css";

const Modal = ({ url, onClose }: any) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${styles.content}`}
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={url}
          width="800"
          height="450"
          title="Iframe Viewer"
          style={{ border: "none", borderRadius: "10px" }}
        ></iframe>
        <button className={styles.closeBtn} onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
};

export default Modal;
