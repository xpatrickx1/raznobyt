import { useLang } from '../../i18n/LangContext';
import '../Trust.css';
import ten from '@/assets/images/suppliers/postavka-ten-cate.webp';
import tencatePermess from '@/assets/images/suppliers/permess.webp';
import toray from '@/assets/images/suppliers/toray.webp';

export default function Trust() {
    const { lang } = useLang();

    return (
        <div className="suppliers-strip">
            <div className="container">
                <div className="suppliers-strip__header">
                    <span className="suppliers-strip__label">
                        {lang === 'ua' ? 'Прямі поставки від' : 'Прямые поставки от'}
                    </span>
                </div>

                <div className="suppliers-strip__logos">
                    <div className="suppliers-strip__item" title="Ten Cate Protect">
                        <img
                            src={ten}
                            alt="Ten Cate Protect"
                            className="suppliers-strip__logo"
                            loading="eager"
                            fetchPriority="low"
                            width="200"
                            height="80"
                        />
                    </div>

                    <div className="suppliers-strip__item" title="Ten Cate Permess">
                        <img
                            src={tencatePermess}
                            alt="Ten Cate Permess"
                            className="suppliers-strip__logo"
                            loading="eager"
                            fetchPriority="low"
                            width="200"
                            height="80"
                        />
                    </div>

                    <div className="suppliers-strip__item" title="Toray">
                        <img
                            src={toray}
                            alt="Toray"
                            className="suppliers-strip__logo"
                            loading="eager"
                            fetchPriority="low"
                            width="200"
                            height="80"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
