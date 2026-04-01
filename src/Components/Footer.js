import React from "react";
import { Link } from "react-router-dom";
import { useSiteInfo, DEFAULT_SITE_INFO } from "../contexts/SiteInfoContext";

function Footer() {
  const { siteInfo } = useSiteInfo();
  const contact = siteInfo?.contact || DEFAULT_SITE_INFO.contact;
  const footerLogoURL = siteInfo?.footerLogoURL || DEFAULT_SITE_INFO.footerLogoURL;

  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Brand Info */}
        <div className="footer-column brand-info">
          <div className="footer-logo">
            <img src={footerLogoURL} alt="Health Care Logo" />
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at
            congue risus. Sed commodo dapibus urna eget malesuada. Suspendisse sed
            lectus ex.
          </p>
        </div>

        {/* Company Links */}
        <div className="footer-column">
          <h3>Company</h3>
          <ul>
            <li><Link to="/">What's New</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/">Blog</Link></li>
            <li><Link to="/">Careers</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="footer-column">
          <h3>Support</h3>
          <ul>
            <li><Link to="/">Help Topics</Link></li>
            <li><Link to="/">Getting Started</Link></li>
            <li><Link to="/">Features</Link></li>
            <li><Link to="/">FAQ</Link></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div className="footer-column contact-social">
          <h3>Contact Us</h3>
          <p><i className="phone-icon"></i> {contact.phone1}</p>
          <p><i className="phone-icon"></i> {contact.phone2}</p>

          <h3>Social Media</h3>
          <div className="social-icons">
            {/* Instagram */}
            <Link to="#" className="social-box">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                style={{ height: "100%", width: "100%" }}
              >
                <g>
                  <path d="M12,2.162c3.204,0,3.584,0.012,4.849,0.07c1.308,0.06,2.655,0.358,3.608,1.311c0.962,0.962,1.251,2.296,1.311,3.608c0.058,1.265,0.07,1.645,0.07,4.849c0,3.204-0.012,3.584-0.07,4.849c-0.059,1.301-0.364,2.661-1.311,3.608c-0.962,0.962-2.295,1.251-3.608,1.311c-1.265,0.058-1.645,0.07-4.849,0.07s-3.584-0.012-4.849-0.07c-1.291-0.059-2.669-0.371-3.608-1.311c-0.957-0.957-1.251-2.304-1.311-3.608c-0.058-1.265-0.07-1.645-0.07-4.849c0-3.204,0.012-3.584,0.07-4.849c0.059-1.296,0.367-2.664,1.311-3.608c0.96-0.96,2.299-1.251,3.608-1.311C8.416,2.174,8.796,2.162,12,2.162 M12,0C8.741,0,8.332,0.014,7.052,0.072C5.197,0.157,3.355,0.673,2.014,2.014C0.668,3.36,0.157,5.198,0.072,7.052C0.014,8.332,0,8.741,0,12c0,3.259,0.014,3.668,0.072,4.948c0.085,1.853,0.603,3.7,1.942,5.038c1.345,1.345,3.186,1.857,5.038,1.942C8.332,23.986,8.741,24,12,24c3.259,0,3.668-0.014,4.948-0.072c1.854-0.085,3.698-0.602,5.038-1.942c1.347-1.347,1.857-3.184,1.942-5.038C23.986,15.668,24,15.259,24,12c0-3.259-0.014-3.668-0.072-4.948c-0.085-1.855-0.602-3.698-1.942-5.038c-1.343-1.343-3.189-1.858-5.038-1.942C15.668,0.014,15.259,0,12,0z"/>
                  <path d="M12,5.838c-3.403,0-6.162,2.759-6.162,6.162c0,3.403,2.759,6.162,6.162,6.162s6.162-2.759,6.162-6.162C18.162,8.597,15.403,5.838,12,5.838z M12,16c-2.209,0-4-1.791-4-4s1.791-4,4-4s4,1.791,4,4S14.209,16,12,16z"/>
                  <circle cx="18.406" cy="5.594" r="1.44"/>
                </g>
              </svg>
            </Link>

            {/* Facebook */}
            <Link to="#" className="social-box">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                style={{ height: "100%", width: "100%" }}
              >
                <g>
                  <path d="M24,12.073c0,5.989-4.394,10.954-10.13,11.855v-8.363h2.789l0.531-3.46H13.87V9.86c0-0.947,0.464-1.869,1.95-1.869h1.509V5.045c0,0-1.37-0.234-2.679-0.234c-2.734,0-4.52,1.657-4.52,4.656v2.637H7.091v3.46h3.039v8.363C4.395,23.025,0,18.061,0,12.073c0-6.627,5.373-12,12-12S24,5.445,24,12.073z"/>
                </g>
              </svg>
            </Link>

            {/* Admin */}
            <Link to="/admin" className="social-box">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    style={{
      borderRadius: "50%",
      color: "#c90f2f",
      background: "white"
    }}
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M9.175 10.825Q8 9.65 8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12t-2.825-1.175M4 20v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z"
    />
  </svg>
</Link>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>© Inmine.com. All rights reserved</p>
        <div className="footer-legal">
          <Link to="/">Term & Condition</Link>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
