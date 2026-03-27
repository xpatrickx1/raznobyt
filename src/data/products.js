import workwear from './products/workwear.json';
import medical from './products/medical.json';
import personal from './products/personal.json';
import shirts from './products/shirts.json';
import protective from './products/protective.json';
import lining from './products/lining.json';

export const productsByCategory = {
    workwear,
    medical,
    personal,
    shirts,
    protective,
    lining
};

const products = [
    ...workwear,
    ...medical,
    ...personal,
    ...shirts,
    ...protective,
    ...lining
];

export default products;
