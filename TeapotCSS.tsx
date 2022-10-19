import { setMaxListeners } from 'events';
import React, {useEffect, useRef, useState} from 'react';
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
            window.addEventListener('resize', () => {
                setVarState(attribute, window.innerWidth, setter)
            })
        }
    }
}
function Container({children, gap, columns,flexGrid, ...props}:propsContainer){
    
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
        let gridAttribute = gridElement!.dataset.tpGrid!
        let gapAttribute = gridElement!.dataset.tpGap
        if(!['auto', 'manual'].includes(gridAttribute)){
            setListener(gridAttribute, setGridState, gridElement)
        }
        else{
            setGridState(gridAttribute)
        }
        if(gapAttribute){
            setListener(gapAttribute, setGapState, gridElement)
        }
        setVarState(gridAttribute, window.innerWidth, setGridState)
    }, [])


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
    const [partState, setPartState] = useState('1')
    const [partYState, setPartYState] = useState('1')
    const styles:CSSvars = {
        "--defaultParte": partState,
        "--defaultParteY": partYState
    }
    const element = useRef(null);
    /* useEffect(()=>{
        const observador =new MutationObserver(()=>{
            let gridSon:any = element.current;
            let partAttribute = gridSon!.dataset.tpPart
            addStyle(gridSon, partAttribute, '--defaultParte')
            let partYAttribute = gridSon!.dataset.tpParty
            addStyle(gridSon, partYAttribute, '--defaultParteY')
            

        })
        observador.observe(element.current!, {
            childList: true, 
            subtree: true,
            attributeFilter: ['data-tp-part', 'data-tp-party'],
        });
        observador.disconnect()
    }) */
    
    useEffect(()=>{
        let gridSon:any = element.current;
        let partAttribute = gridSon!.dataset.tpPart
        setListener(partAttribute, setPartState, gridSon)
        let partYAttribute = gridSon!.dataset.tpParty
        setListener(partYAttribute, setPartYState, gridSon)
    },[])
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