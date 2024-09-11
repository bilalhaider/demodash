export interface Intensity {
    data?: {
        from?: string;
        to?: string;
        intensity?: {
            forecast?: number;
            actual?: number;
            index?: 'very low' | 'low' | 'moderate' | 'high' | 'very high';
        };
    }[];
}

export interface Factors {
    data?: {
        Biomass?: number;
        Coal?: number;
        DutchImports?: number;
        FrenchImports?: number;
        GasCombinedCycle?: number;
        GasOpenCycle?: number;
        Hydro?: number;
        IrishImports?: number;
        Nuclear?: number;
        Oil?: number;
        Other?: number;
        PumpedStorage?: number;
        Solar?: number;
        Wind?: number;
    }[];
}

export interface Error {
    error?: {
        code?: string;
        message?: string;
    };
}

export interface Statistics {
    data?: {
        from?: string;
        to?: string;
        intensity?: {
            max?: number;
            average?: number;
            min?: number;
            index?: 'very low' | 'low' | 'moderate' | 'high' | 'very high';
        };
    }[];
}

export interface RegionalFromTo {
    data?: {
        from?: string;
        to?: string;
        regions?: {
            regionid?: number;
            dnoregion?: string;
            shortname?: string;
            postcode?: string;
            intensity?: {
                forecast?: number;
                index?: 'very low' | 'low' | 'moderate' | 'high' | 'very high';
            };
            generationmix?: {
                fuel?: string;
                perc?: number;
            }[];
        }[];
    }[];
}

export interface RegionalID {
    data?: {
        regionid?: number;
        dnoregion?: string;
        shortname?: string;
        postcode?: string;
        data?: {
            from?: string;
            to?: string;
            intensity?: {
                forecast?: number;
                index?: 'very low' | 'low' | 'moderate' | 'high' | 'very high';
            };
            generationmix?: {
                fuel?: string;
                perc?: number;
            }[];
        }[];
    }[];
}

export interface Generation {
    data?: {
        from?: string;
        to?: string;
        generationmix?: {
            fuel?: string;
            perc?: number;
        }[];
    }[];
}

export interface GenerationSingle {
    data?: {
        from?: string;
        to?: string;
        generationmix?: {
            fuel?: string;
            perc?: number;
        }[];
    };
}

