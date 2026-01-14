import '../../CSS/footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faYoutube, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = ({ business }) => {
  if (!business) return null;

  return (
    <footer className="gallery-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Logo section */}
          {business.logo && (
            <div className="footer-logo">
              <img src={business.logo} alt={`${business.name} logo`} className="business-logo" />
            </div>
          )}

          {/* Business info section */}
          <div className="footer-info">
            <h3 className="business-name">{business.name}</h3>

            {/* Contact info */}
            <div className="contact-info">
              {business.address && (
                <div className="contact-item">
                  <span className="contact-value">{business.address}</span>
                </div>
              )}

              {business.email && (
                  <div className="contact-item">
                    <span className="contact-value bold">{business.email}</span>
                  </div>
              )}

              {business.phone && (
                  <div className="contact-item">
                    <span className="contact-value">{business.phone}</span>
                  </div>
              )}

            </div>

          {/* Social media section */}
          <div className="social-media-section">
            <p className="follow-us-text">Follow us on</p>
            <div className="social-icons">
              {business.instagram && (
                <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="social-icon instagram" aria-label="Instagram">
                  <FontAwesomeIcon icon={faInstagram} className="font-awesome-icon" />
                </a>
              )}
              {business.facebook && (
                <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="social-icon facebook" aria-label="Facebook">
                  <FontAwesomeIcon icon={faFacebook} className="font-awesome-icon" />
                </a>
              )}
              {business.youtube && (
                <a href={business.youtube} target="_blank" rel="noopener noreferrer" className="social-icon youtube" aria-label="YouTube">
                  <FontAwesomeIcon icon={faYoutube} className="font-awesome-icon" />
                </a>
              )}
              {business.twitter && (
                <a href={business.twitter} target="_blank" rel="noopener noreferrer" className="social-icon twitter" aria-label="Twitter">
                  <FontAwesomeIcon icon={faTwitter} className="font-awesome-icon" />
                </a>
              )}
              {business.linkedin && (
                <a href={business.linkedin } target="_blank" rel="noopener noreferrer" className="social-icon linkedin" aria-label="LinkedIn">
                  <FontAwesomeIcon icon={faLinkedin} className="font-awesome-icon" />
                </a>
              )}
            </div>
          </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} Snox. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
