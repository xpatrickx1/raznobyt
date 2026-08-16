import { useLang } from '../../i18n/LangContext';
import ten from '@/assets/images/suppliers/postavka-ten-cate.png';
import tootal from '@/assets/images/suppliers/tootal.jpg';
import concordia from '@/assets/images/suppliers/concordia.svg';
import tencatePermess from '@/assets/images/suppliers/permess.png';
import toray from '@/assets/images/suppliers/toray.png';

export default function Trust() {
    const { lang, t } = useLang();

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
                            loading="lazy"
                        />
                    </div>

                    <div className="suppliers-strip__item" title="Tootal">
                        <img
                            src={tootal}
                            alt="Tootal"
                            className="suppliers-strip__logo"
                            loading="lazy"
                        />
                    </div>

                    <div className="suppliers-strip__item" title="Concordia">
                        <img
                            src={concordia}
                            alt="Concordia"
                            className="suppliers-strip__logo"
                            loading="lazy"
                        />
                    </div>

                    <div className="suppliers-strip__item" title="Ten Cate Permess">
                        <img
                            src={tencatePermess}
                            alt="Ten Cate Permess"
                            className="suppliers-strip__logo"
                            loading="lazy"
                        />
                    </div>

                    <div className="suppliers-strip__item" title="Toray">
                        <img
                            src={toray}
                            alt="Toray"
                            className="suppliers-strip__logo"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}   