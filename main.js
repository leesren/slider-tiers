const PRICING_DATA = { 
    "tiers": [
        {
            "max": 500,
            "txn": 0.02,
            "infra": 10
        },
        {
            "max": 1000,
            "txn": 0.018,
            "infra": 25
        },
        {
            "max": 5000,
            "txn": 0.016,
            "infra": 50
        },
        {
            "max": 50000,
            "txn": 0.014,
            "infra": 100
        },
        {
            "max": null
        }
    ]
}
let SLIDER_CONFIG = {
    initialPercentage: 0.399,
    dom: {
        container: document.querySelector('.slider-container'), 
        knob: document.querySelector('.slider-container .knob'),
        activeRail: document.querySelector('.slider-container .rail.active'),
        activeRailItems: Strut.queryArray('.slider-container .rail.active li') 
    } 
};

const PRICING = new PricingCalculator();
setTimeout(()=>{
    PRICING.setPercentage(SLIDER_CONFIG.initialPercentage)
},600)