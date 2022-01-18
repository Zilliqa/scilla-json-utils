export declare const extractTypes: (type: string) => string[];
export declare const getJSONValue: (value: any, type?: string | undefined) => any;
export declare const getJSONParams: (obj: {
    [x: string]: any;
}) => {
    type: any;
    value: any;
    vname: string;
}[];
