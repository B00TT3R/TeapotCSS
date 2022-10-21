type CSSVarName = `--${Uncapitalize<string>}`;
interface CSSvars{
    [key:CSSVarName]:string|number|undefined;
}
interface propsContainer extends React.HTMLAttributes<HTMLDivElement>{
    children?: React.ReactNode;
    gap?: string;
    columns?: string;
    flexGrid?: boolean;
}
interface propsChild extends React.HTMLAttributes<HTMLDivElement>{
    children?: React.ReactNode;
    parts?: string;
    partY?: string;
}
export { CSSVarName,CSSvars,propsContainer,propsChild };