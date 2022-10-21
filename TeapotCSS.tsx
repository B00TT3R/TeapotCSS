import { setMaxListeners } from 'events';
import React, {useEffect, useRef, useState} from 'react';
import './TeapotCSS.css'
import {propsContainer, propsChild, CSSvars, CSSVarName} from './TeapotCSS.d'
function setVarState(attribute:string, containerWidth:number, setter:Function ){
    const breakpoints = [576, 768, 992, 1200, 1400];
    var valuesArray = attribute.split('-');
    let breakpointIndex = breakpoints.findIndex(breakpoint => containerWidth <= breakpoint)
    if(breakpointIndex == -1 || breakpointIndex >= valuesArray.length){
        breakpointIndex = valuesArray.length-1
    }
    setter(valuesArray[breakpointIndex])
}

function fatherEventListener(attribute:string, setter:React.SetStateAction<any>, element:HTMLDivElement){
    const breakpoints = [576, 768, 992, 1200, 1400];
    let strippedAttribute = attribute.slice(1, -1);
    let valuesArray = strippedAttribute.split('-');
    var containerWidth = element.parentElement!.offsetWidth;
    let breakpointIndex = breakpoints.findIndex(breakpoint => containerWidth <= breakpoint)
    if(breakpointIndex == -1 || breakpointIndex >= valuesArray.length){
        breakpointIndex = valuesArray.length-1
    }
    setter(valuesArray[breakpointIndex])
}
function setListener(attribute:string, setter:React.SetStateAction<any>, element:HTMLDivElement){
    if(attribute.split('-').length <= 1){
        setter(attribute)
    }
    else{
        if(attribute.startsWith('[') && attribute.endsWith(']')){
            fatherEventListener(attribute, setter, element)
            new ResizeObserver(() => {
                fatherEventListener(attribute, setter, element)
            }).observe(element.parentElement as Element);
        }
        else{
            setVarState(attribute, window.innerWidth, setter)
            window.addEventListener('resize', () => {
                setVarState(attribute, window.innerWidth, setter)
                
            })
        }
    }
}
function Container({children, gap, columns, flexGrid, ...props}:propsContainer){
    
    const [gridState, setGridState] = useState('auto')
    const [gapState, setGapState] = useState('0px')

    const styles:CSSvars = {
        "--defaultGap": gap,
        "--defaultColumns": gridState
    }
    const father = useRef(null);
    useEffect(()=>{
        /* const observador = new MutationObserver(()=>{
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
        }); */
        
    })
    useEffect(()=>{
        let gridElement:HTMLDivElement = father.current!;
        let gridAttribute = columns || '1'
        let gapAttribute = gap || '0px'
        setVarState(gridAttribute, window.innerWidth, setGridState)
        if(!['auto', 'manual'].includes(gridAttribute)){
            setListener(gridAttribute, setGridState, gridElement)
        }
        else{
            setGridState(gridAttribute)
        }
        if(gapAttribute){
            setListener(gapAttribute, setGapState, gridElement)
        }
    }, [])


    return(
        <>
            <div
                data-tp-grid={columns}
                data-tp-gap={gap}
                data-tp-flex={flexGrid}
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
    const [partState, setPartState] = useState('1')
    const [partYState, setPartYState] = useState('1')
    const styles:CSSvars = {
        "--defaultParte": partState,
        "--defaultParteY": partYState
    }
    const element = useRef(null);
    useEffect(()=>{
        let gridSon:any = element.current;
        let partAttribute = parts || '1'
        setListener(partAttribute, setPartState, gridSon)
        let partYAttribute = partY || '1'
        setListener(partYAttribute, setPartYState, gridSon)
    },[])
    return(
            <div
                data-tp-part={parts}
                data-tp-party={partY}
                ref={element}
                {...props}
                style={styles}
            >
                {children}
            </div>
    )
}
export {Container, Child};