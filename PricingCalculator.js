class PricingCalculator {
    constructor(percentage) {
        this.percentage = percentage || 0;
        this.init();
    }

    init() {
        PRICING_DATA.tiers = PRICING_DATA.tiers.map((tier, i) => {
            tier.min = (i === 0) ? 0 : PRICING_DATA.tiers[i - 1].max;
            return tier;
        });

        UTIL.addNormalizedListener(SLIDER_CONFIG.dom.activeRail, 'down', (e, p) => {
            this.dragging = true;
            this.railRect = SLIDER_CONFIG.dom.activeRail.getBoundingClientRect();
            this.setPercentage(Strut.clamp(
                Strut.rangePosition(this.railRect.left, this.railRect.left + this.railRect.width, e.clientX),
                0, 1
            ));
            UTIL.setVendorStyle(SLIDER_CONFIG.dom.container, 'user-select', 'none');
        });

        UTIL.addNormalizedListener(SLIDER_CONFIG.dom.knob, 'down', (e, p) => {
            this.dragging = true;
            this.railRect = SLIDER_CONFIG.dom.activeRail.getBoundingClientRect();
            UTIL.setVendorStyle(SLIDER_CONFIG.dom.container, 'user-select', 'none');
        });

        UTIL.addNormalizedListener(document.body, 'up', (e, p) => {
            this.dragging = false;
            UTIL.setVendorStyle(SLIDER_CONFIG.dom.container, 'user-select', 'auto');
        });

        UTIL.addNormalizedListener(document.body, 'move', (e, p) => {
            if (this.dragging) {
                e.preventDefault();
                this.setPercentage(Strut.clamp(
                    Strut.rangePosition(this.railRect.left, this.railRect.left + this.railRect.width, p.x),
                    0, 1
                ));
            }
        });
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        SLIDER_CONFIG.dom.knob.style.left = (this.percentage * 100) + '%';

        // Calculate pricing 第几段
        let tierIndex = Math.min(Math.floor(this.percentage * PRICING_DATA.tiers.length), PRICING_DATA.tiers.length - 1);
 

        let tierPerc = Strut.rangePosition(
            tierIndex / PRICING_DATA.tiers.length,
            (tierIndex + 1) / PRICING_DATA.tiers.length,
            this.percentage
        );

        // Update rail
        SLIDER_CONFIG.dom.activeRailItems.forEach((el, i) => {
            if (i < tierIndex) {
                el.style.width = (100 / PRICING_DATA.tiers.length) + '%';
                el.style.display = 'block';
            } else if (i == tierIndex) {
                el.style.width = (100 / PRICING_DATA.tiers.length) * tierPerc + '%';
                el.style.display = 'block';
            } else {
                el.style.display = 'none';
            }
        });
    }; 
} 