import styles from "./styles.module.css";

const Card = ({ image, title, onClick }: any) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <img src={image} alt={title} className={styles.image} />
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
};

export default Card;
