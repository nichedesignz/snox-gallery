import '../../CSS/gallerystyle.css';
import '../../CSS/naveventstyle.css';

const GalleryNavigation = ({ galleries, selectedGallery, onGalleryClick, showCount = false }) => {
  return (
    <div className="albumnav">
      {galleries.map((gallery) => (
        <button
          key={gallery.id}
          className={`albumnavlink ${selectedGallery === gallery.id ? 'selected' : ""}`}
          onClick={() => onGalleryClick(gallery.id)}
        >
          {gallery.name}
          {showCount && gallery.imageCount !== undefined && ` (${gallery.imageCount})`}
        </button>
      ))}
    </div>
  );
};

export default GalleryNavigation;
