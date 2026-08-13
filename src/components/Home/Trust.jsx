import { useLang } from '../../i18n/LangContext';

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
                            src="/images/suppliers/tencate.svg"
                            alt="Ten Cate Protect"
                            className="suppliers-strip__logo"
                            loading="lazy"
                        />
                    </div>

                    <div className="suppliers-strip__item" title="Tootal">
                        <img
                            src="/images/suppliers/tootal.svg"
                            alt="Tootal"
                            className="suppliers-strip__logo"
                            loading="lazy"
                        />
                    </div>

                    <div className="suppliers-strip__item" title="Concordia">
                        <img
                            src="/images/suppliers/concordia.svg"
                            alt="Concordia"
                            className="suppliers-strip__logo"
                            loading="lazy"
                        />
                    </div>

                    <div className="suppliers-strip__item" title="Ten Cate Permess">
                        <img
                            src="/images/suppliers/tencate-permess.svg"
                            alt="Ten Cate Permess"
                            className="suppliers-strip__logo"
                            loading="lazy"
                        />
                    </div>

                    <div className="suppliers-strip__item" title="Toray">
                        <img
                            src="/images/suppliers/toray.svg"
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