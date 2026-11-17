import workwear from './products/workwear.json';
import medical from './products/medical.json';
import personal from './products/personal.json';
import shirts from './products/shirts.json';
import industrial from './products/industrial.json';
import interlinings from './products/interlinings.json';
import fire from './products/fire.json';
import army from './products/army.json';
import jackets from './products/jackets.json';
import cotton from './products/cotton.json';
import linen from './products/linen.json';
import jeans from './products/jeans.json';
import fleece from './products/fleece.json';
import canvas from './products/canvas.json';
import cordura from './products/cordura.json';

export const productsByCategory = {
    workwear,
    medical,
    personal,
    fire,
    army,
    shirts,
    industrial,
    interlinings,
    jackets,
    cotton,
    linen,
    jeans,
    fleece,
    canvas,
    cordura
};

const products = [
    ...workwear,
    ...medical,
    ...personal,
    ...shirts,
    ...industrial,
    ...interlinings,
    ...fire,
    ...army,
    ...jackets,
    ...cotton,
    ...linen,
    ...jeans,
    ...fleece,
    ...canvas,
    ...cordura
];

export default products;
