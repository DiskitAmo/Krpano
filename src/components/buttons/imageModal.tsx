import styles from "./modal.module.css";

const ImageModal = ({ src, onClose }: any) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img
          src={src}
          alt="Preview"
          style={{ maxWidth: "100%", borderRadius: "10px" }}
        />
        <button className={styles.closeBtn} onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
