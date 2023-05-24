/// <reference types="react-scripts" />

declare module "*.svg" {
    export const ReactComponent: React.FunctionComponent<
        React.SVGAttributes<SVGElement>
    >;
    const url: string;
    export default url;
}
