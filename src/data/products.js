import workwear from './products/workwear.json';
import medical from './products/medical.json';
import personal from './products/personal.json';
import shirts from './products/shirts.json';
import industrial from './products/industrial.json';
import lining from './products/lining.json';

export const productsByCategory = {
    workwear,
    medical,
    personal,
    shirts,
    industrial,
    lining
};

const products = [
    ...workwear,
    ...medical,
    ...personal,
    ...shirts,
    ...industrial,
    ...lining
];

export default products;
