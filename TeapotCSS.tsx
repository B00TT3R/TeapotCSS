import React, {useEffect,  useRef} from 'react';
import './TeapotCSS.css'
import {propsContainer, propsChild, CSSvars, CSSVarName} from './TeapotCSS.d'
function setVar(element:HTMLDivElement, rawValue:string, propName:CSSVarName){
    const breakpoints = [576, 768, 992, 1200, 1400];
    if(rawValue.startsWith('[') && rawValue.endsWith(']')){
        rawValue = rawValue.slice(1, -1);
        var valuesArray = rawValue.split('-');
        var containerWidth = element.parentElement!.offsetWidth;
    }
    else{
        var valuesArray = rawValue.split('-');
        var containerWidth = window.innerWidth
    }
    let breakpointIndex = breakpoints.findIndex(breakpoint => containerWidth <= breakpoint)
    if(breakpointIndex == -1 || breakpointIndex >= valuesArray.length){
        breakpointIndex = valuesArray.length-1
    }
    element.style.setProperty(propName, valuesArray[breakpointIndex])
}
function resizeListener(element:HTMLDivElement, rawValue:string, propName:CSSVarName){
    setVar(element, rawValue, propName)
    if(rawValue.startsWith('[') && rawValue.endsWith(']')){
        new ResizeObserver(() => {
            setVar(element, rawValue, propName)
        }).observe(element.parentElement as Element);
    }
    else{
        window.addEventListener('resize', () => {
            setVar(element, rawValue, propName)
        })
    }
}
function addStyle(element:HTMLDivElement, rawValue:string, propName:CSSVarName){
    if(rawValue.split('-').length <= 1){
        element.style.setProperty(propName, rawValue)
    }
    else{
        resizeListener(element, rawValue, propName)
    }
}
function Container({children, gap, columns,flexGrid, ...props}:propsContainer){
    
    
    const styles:CSSvars = {
        "--defaultGap": gap,
        "--defaultColumns": columns
    }
    const father = useRef(null);
    useEffect(()=>{
        const observador = new MutationObserver(()=>{
            let gridElement:HTMLDivElement = father.current!;
            let gridAttribute = gridElement!.dataset.tpGrid!
            let gapAttribute = gridElement!.dataset.tpGap        
            if(!['auto', 'manual'].includes(gridAttribute)){
                addStyle(gridElement, gridAttribute, '--defaultColumns')
            }
            if(gapAttribute){
                addStyle(gridElement, gapAttribute, '--defaultGap')
            }
            observador.disconnect()
        })
        observador.observe(father.current!, {
            childList: true, 
            subtree: true,
            attributeFilter: ['data-tp-grid', 'data-tp-gap'],
        });
        
    })
    return(
        <>
            <div
                data-tp-grid={columns||'manual'}
                data-tp-gap={gap||'0px'}
                data-tp-flexgrid={flexGrid}
                style={styles}
                ref={father}
                {...props}
            >
                {children}
            </div>
        </>
    )
}

function Child({children,parts, partY, ...props}:propsChild){
    const styles:CSSvars = {
        "--defaultParte": parts,
        "--defaultParteY": partY
    }
    const element = useRef(null);
    useEffect(()=>{
        const observador =new MutationObserver(()=>{
            let gridSon:any = element.current;
            let partAttribute = gridSon!.dataset.tpPart
            addStyle(gridSon, partAttribute, '--defaultParte')
            //acho q tenho q modificar esse addstyle pra um useState

            let partYAttribute = gridSon!.dataset.tpParty
            addStyle(gridSon, partYAttribute, '--defaultParteY')
            

        })
        observador.observe(element.current!, {
            childList: true, 
            subtree: true,
            attributeFilter: ['data-tp-part', 'data-tp-party'],
        });
        observador.disconnect()
    })
    return(
            <div
                ref={element}
                data-tp-part={parts||'1'}
                data-tp-party={partY||'1'}
                {...props}
                style={styles}
            >
                {children}
            </div>
    )
}
export {Container, Child};