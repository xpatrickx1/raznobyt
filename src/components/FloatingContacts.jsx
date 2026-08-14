import './FloatingContacts.css';
import viberIcon from '@/assets/images/icons/viber.svg';

const PHONE = '0673320088';
const PHONE_DISPLAY = '(067) 332-00-88';

export default function FloatingContacts() {
    return (
        <div className="floating-contacts" aria-label="Зв'язатися з нами">
            <a
                href={`viber://chat?number=%2B38${PHONE}`}
                className="floating-btn floating-btn--viber"
                title={`Viber: ${PHONE_DISPLAY}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Написати у Viber"
            >
                <img src={viberIcon} alt="Viber" width="32" height="32" loading="lazy" />
            </a>

            <a
                href={`https://t.me/+38${PHONE}`}
                className="floating-btn floating-btn--telegram"
                title={`Telegram: ${PHONE_DISPLAY}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Написати у Telegram"
            >
                <svg viewBox="0 0 28 28" fill="none"> <rect width="28" height="28" fill="#37AEE2"></rect> <path fill-rule="evenodd" clip-rule="evenodd" d="M6.09957 14.387C10.3931 12.5164 13.2561 11.2832 14.6886 10.6874C18.7788 8.98615 19.6287 8.69061 20.1826 8.68083C20.3045 8.6787 20.5769 8.7089 20.7533 8.8521C21.0151 9.06451 21.0166 9.52556 20.9875 9.83071C20.7659 12.1596 19.8068 17.8111 19.3189 20.4195C19.1124 21.5231 18.7059 21.8932 18.3124 21.9294C17.4571 22.0081 16.8076 21.3642 15.9792 20.8212C14.683 19.9715 13.9507 19.4425 12.6924 18.6134C11.2383 17.6551 12.1809 17.1285 13.0096 16.2677C13.2265 16.0425 16.9949 12.6148 17.0678 12.3039C17.077 12.265 17.0854 12.12 16.9993 12.0435C16.9132 11.967 16.7861 11.9931 16.6944 12.0139C16.5644 12.0434 14.4936 13.4122 10.482 16.1201C9.89423 16.5237 9.36184 16.7203 8.88484 16.71C8.35895 16.6987 7.34743 16.4127 6.59543 16.1683C5.67309 15.8685 4.94002 15.7099 5.00388 15.2008C5.03713 14.9355 5.40234 14.6643 6.09957 14.387Z" fill="white"></path> </svg>
            </a>
        </div>
    );
}
