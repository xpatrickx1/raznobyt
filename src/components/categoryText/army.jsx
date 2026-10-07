import CategoryHighlight from '../CategoryHighlight';
import { armyItems } from './armyHighlights.js';
import { useLang } from '../../i18n/LangContext';
import army2 from '/images/catimg/army/army2.jpg';

const ArmyText = () => {
    const { lang } = useLang();
    return (
        <div className="seo-category-text">
            <h2>Армія та поліція</h2>

            <p>
                Коли солдати або спецназівці наражаються на небезпеку вибуху і горіння
                палива, різниця між життям та смертю може вимірюватися в секундах.
                Завдяки запатентованій суміші волокон, включаючи Lenzing® FR, унікальній
                тепло- і вогнестійкій властивості, TenCate Defeder™ M забезпечує
                віськовому ці дорогоційні додаткові секунди захисту.
            </p>


            <div style={{ display: "flex", gap: 20, alignItems: "center", margin: "20px 0" }}>
                <div>
                    <p style={{ marginBottom: 0, maxWidth: "50%" }}>
                        TenCate Defender™ М забезпечує комплексний захист під час дії полум'я і
                        високої температури у разі пожежі або вибуху.
                        <br />
                        TenCate Defender™ М швидко гасне.
                        <br />
                        TenCate Defender™ М не плавиться, не прилипає до шкіри, що мінімізує
                        ризик травми та загибелі людей від опіків. Тепло- та вогнетривкі
                        властивості TenCate Defender™ М завжди притаманні тканини. Вони не
                        змиваються та не зношуються, незалежно від того, скільки разів військова
                        форма пралася або як довго вона носиться.
                    </p>

                    <p style={{ padding: "20px 0", margin: 0 }}>
                        Ці перевірені тканини поставляються мільйонам солдат та поліцейським по
                        всьому світі, захищаючи їх в небезпечних зонах конфліктів - на суші, в
                        повітрі та у морі.
                    </p>

                    <p>
                        Якщо ви шукаєте найефективніші властивості вогнезахисної тканини для
                        оперативних форм, вибір ясний - TenCate Defender™ М!
                    </p>
                </div>

                <img src={army2} alt="" />
            </div>



            <CategoryHighlight
                items={armyItems}
            />
        </div>
    );
};

export default ArmyText;