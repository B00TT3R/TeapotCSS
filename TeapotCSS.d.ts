type CSSVarName = `--${Uncapitalize<string>}`;
interface CSSvars{
    [key:CSSVarName]:string|number|undefined;
}
interface propsContainer extends React.HTMLAttributes<HTMLDivElement>{
    children?: React.ReactNode;
    gap?: string;
    columns?: string|number;
    flexGrid?: boolean;
}
interface propsChild extends React.HTMLAttributes<HTMLDivElement>{
    children?: React.ReactNode;
    parts?: string|number;
    partY?: string|number;
}
export { CSSVarName,CSSvars,propsContainer,propsChild };