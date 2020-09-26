import React from 'react'

import { fade } from '@material-ui/core/styles'

import makeStyles from '@material-ui/core/styles/makeStyles'

import Avatar from '@material-ui/core/Avatar'

import { GET_ENTITY_COLOR } from '../../../config'

import {Chip} from '@material-ui/core';


const useStyles = makeStyles(theme => ({
	avatar: {
		paddingLeft: theme.spacing(0.5),
		paddingRight:theme.spacing(0.5),
		paddingTop: theme.spacing(0.5),
		paddingBottom:theme.spacing(0.5),
	},
	stakeholderChips: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		marginBottom: theme.spacing(1),
		marginTop: theme.spacing(1),
		height: "50px"
	}
}))


const PatternVisualization = props => {
	const { displayDynamic, positionData, linkData, height, width, nodeRadius, hovered, searched, onPath, selectedItem, handleNodeEnter, handleNodeLeave, handleNodeClick } = props
	const classes = useStyles()
	return (
		<svg viewBox={`0 -30 ${width} ${height + 70}`}>
			{displayDynamic && positionData.map(level => level.entities.map((entity, index) => {
				const padding = 50	
				return (

					
					
					<g key={index}>
						<filter id='entity-shadow' height='130%'>
							<feDropShadow id='entity-shadow' dx='5' dy='5' stdDeviation='4' floodColor='darkgray' floodOpacity='0.4'/>
						</filter>
						<rect x={entity.startX + (padding || 0) / 2} y={entity.startY + (padding || 0) / 2} width={entity.width - (padding || 0)} height={entity.height - (padding || 0)} fill='#f0f0f0' rx={5} ry={5} filter='url(#entity-shadow)' />
						<text x={entity.startX + (padding || 0) / 2} y={entity.startY + (padding || 0) / 3} fontFamily='Raleway' fontSize={nodeRadius * 1.2}>{entity.entityName}</text>
					</g>
				)
			}))}

			{displayDynamic && positionData.map(level => level.entities.map(entity => entity.categories.map((category, index) => {
				
				
				
				
				if (category.categoryName !== 'all') {
					let wid = 0;
					let calw = 0;
					if(category.data.length == 5)
					{
						calw = category.data[4].startX - category.data[0].startX;
						wid = (calw + 75);
					}
					else if(category.data.length == 1)
					wid = 82;
					else if(category.data.length == 2)
					{
						calw = category.data[1].startX - category.data[0].startX;
						wid = (calw + 75);
					}
					if(category.data.length == 3)
					{
						calw = category.data[2].startX - category.data[0].startX;
						wid = (calw + 75);
					}
					if(category.data.length == 4)
					{
						calw = category.data[3].startX - category.data[0].startX;
						wid = (calw + 75);
					}
					if(category.data.length == 6)
					{
						calw = category.data[5].startX - category.data[0].startX;
						wid = (calw + 75);
					}
					if(category.data.length == 7)
					{
						calw = category.data[6].startX - category.data[0].startX;
						wid = (calw + 75);
					}
					if(category.data.length == 8)
					{
						calw = category.data[7].startX - category.data[0].startX;
						wid = (calw + 75);
					}
					return (
						<g key={index}>
							
							<text x={category.startX + category.width / 2} y={category.startY - 5} textAnchor='middle' fontFamily='Raleway' fontSize={nodeRadius * 0.8}>{category.categoryName}</text>
							{<rect x={category.data[0].startX - 40} y={category.startY} width={wid} height={category.height} style={{ stroke: '#bfbfbf', strokeWidth: 2, fillOpacity: 0 }}/>}
						</g>
					)
				}
			})))}
			

			{linkData.map((link, index) => {
				const highlighted = onPath.length === 0 || (onPath.includes(link[0].identifier) && onPath.includes(link[1].identifier))
				if(link[0].startY < 100)
				{
				return (
					<g key={index}>
						<defs>
							<marker
								id='pattern_arrow'
								markerHeight={nodeRadius / 2}
								markerWidth={nodeRadius / 2}
								markerUnits='strokeWidth'
								orient='auto'
								refX={5 + nodeRadius / 2}
								viewBox='-5 -5 10 10'
							>
								<path d='M 0,0 m -5,-5 L 5,0 L -5,5 Z' fill='gray' />
							</marker>
						</defs>

						<line
							x1={link[0].startX}
							y1={link[0].startY + 27.5}
							x2={link[1].startX}
							y2={link[1].startY}
							style={onPath.length === 0 && displayDynamic ? { stroke: fade('#9c9c9c', 0.3), strokeWidth: 1 } : highlighted || !displayDynamic ? { stroke: '#9c9c9c', strokeWidth: 2 } : { stroke: fade('#9c9c9c', 0.2), strokeWidth: 1 }}
							markerEnd={(onPath.includes(link[0].identifier) && onPath.includes(link[1].identifier)) || !displayDynamic ? 'url(#pattern_arrow)' : ''}
						/>
					</g>
				)}
				else{
					return (
						<g key={index}>
							<defs>
								<marker
									id='pattern_arrow'
									markerHeight={nodeRadius / 2}
									markerWidth={nodeRadius / 2}
									markerUnits='strokeWidth'
									orient='auto'
									refX={5 + nodeRadius / 2}
									viewBox='-5 -5 10 10'
								>
									<path d='M 0,0 m -5,-5 L 5,0 L -5,5 Z' fill='gray' />
								</marker>
							</defs>
	
							<line
								x1={link[0].startX}
								y1={link[0].startY}
								x2={link[1].startX}
								y2={link[1].startY}
								style={onPath.length === 0 && displayDynamic ? { stroke: fade('#9c9c9c', 0.3), strokeWidth: 1 } : highlighted || !displayDynamic ? { stroke: '#9c9c9c', strokeWidth: 2 } : { stroke: fade('#9c9c9c', 0.2), strokeWidth: 1 }}
								markerEnd={(onPath.includes(link[0].identifier) && onPath.includes(link[1].identifier)) || !displayDynamic ? 'url(#pattern_arrow)' : ''}
							/>
						</g>
					)
				}
			})}

			{positionData.map(level => level.entities.map(entity => entity.categories.map(category => category.data.map((item, index) => {
				const highlighted = searched.length === 0 ? onPath.length === 0 || onPath.includes(item.identifier) : searched.includes(item.identifier) || onPath.includes(item.identifier)

				

				if(entity.entityName === 'Stakeholders')
				{
					let is = item.identifier.length
					let rs = item.name.length
					let sr;
					if (rs <= 9) {
						sr = 9 + (rs/4)
					}
					else if (rs <= 12) {
						sr = 12 + (rs/4)
					} 
					else if (rs == 15) {
						sr = 18 + (rs/4)
					} 
					else if ( rs == 16) {
						sr = 11 + (rs/2)
					} 
					else if ( rs <= 17) {
						sr = 12 + (rs/2)
					} 
					else if ( rs <= 18) {
						sr = 9 + (rs/2)
					}
					else if ( rs > 18) {
						sr = 14 + (rs/2)
					}

					let cs = rs
					if(rs < 13 && rs > 11)
					{rs = rs + (rs / (2 * rs))
				     cs = cs - (cs / (5 * cs))}
				    else if(rs > 17 && is > 3)
					{rs = rs - (rs / 5)
					 cs = cs - (cs / 5.5)}
					else if(rs < 12)
					 rs = rs + (rs / (rs + 1))
					else if(rs > 15 && is > 3 )
					{rs = rs - (rs / 7.5)
					 cs = cs - (cs / 9)}
					else if(is < 4 && rs > 16 )
					{rs = rs - (rs / 5)
					 cs = cs - (cs / 6)}
					else if(is < 4 && rs == 16)
					rs =  rs - (rs / 12.5)
					
					
				
					return (
            <g
              key={index}
              onMouseEnter={() =>
                handleNodeEnter && handleNodeEnter(item.identifier)
              }
              onMouseLeave={handleNodeLeave && handleNodeLeave}
              onClick={() => handleNodeClick(item, entity.entityName)}
              style={{ cursor: "pointer" }}
            >
              <foreignObject
                width={rs * 17}
                height="80"
                x={item.startX - rs * 6.5}
                y={item.startY - 30}
              >
                <Chip
                  className={classes.stakeholderChips}
                  avatar={
                    <Avatar className={classes.avatar}>
                      {item.identifier}
                    </Avatar>
                  }
                  label={item.name}
                />
              </foreignObject>
            </g>
          );


				}	
				return (
					
					
					<g
						key={index}
						onMouseEnter={() => handleNodeEnter && handleNodeEnter(item.identifier)}
						onMouseLeave={handleNodeLeave && handleNodeLeave}
						onClick={() => handleNodeClick(item, entity.entityName)}
						style={{ cursor: 'pointer' }}
					>
                   
						<circle
							cx={item.startX}
							cy={item.startY}
							r={nodeRadius}
							fill={highlighted ? GET_ENTITY_COLOR(entity.entityName) : fade(GET_ENTITY_COLOR(entity.entityName), 0.2)}
							strokeWidth={selectedItem === item.identifier ? 7 : 4}
						/>
						{entity.entityName ==="Stakeholders" ? <text x={item.startX} y={item.startY - 40} textAnchor='middle' alignmentBaseline='central' fontFamily='Raleway' fontSize={nodeRadius * 0.8} fill="black">{item.name}</text> : null}
						<text x={item.startX} y={item.startY} textAnchor='middle' alignmentBaseline='central' fontFamily='Raleway' fontSize={nodeRadius * 0.7} fill='white'>{item.identifier}</text>
						
					</g>
				)
			}))))}

			{positionData.map(level => level.entities.map(entity => entity.categories.map(category => category.data.map((item, index) => {
				const maxCharactersInRow = 30
				let words = item.name.split(' ')
				let textLines = []
				while (words.length !== 0) {

					let line = []
					while (line.length <= maxCharactersInRow && words.length !== 0) {
						if (line.length + words[0].length <= maxCharactersInRow) {
							const word = words.shift()
							line += line.length !== 0 ? ' ' + word : word
						} else {
							break
						}
					}
					textLines.push(line)
				}

				const mirrorHorizontally = item.startX > width - 300
				const mirrorVertically = item.startY < 200

				return (
					<g key={index} visibility={hovered === item.identifier ? 'visible' : 'hidden'} filter='url(#tooltip-shadow)'>
						<filter id='tooltip-shadow' height='130%'>
							<feDropShadow id='tooltip-shadow' dx='3' dy='3' stdDeviation='2' floodColor='darkgray' floodOpacity='0.4' />
						</filter>
						<path fill='#fafafa'  transform={`translate(${item.startX - (mirrorHorizontally ? -18 : 12)}, ${item.startY - (mirrorVertically ? -170 : 170)}) scale(11, 7) scale(${mirrorHorizontally ? -1 : 1}, ${mirrorVertically ? -1 : 1})`} d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
						<text fontFamily='Raleway' fontSize={nodeRadius * 0.7} textAnchor='middle'>
							{textLines.map((line, index) => {
								return (
									<tspan key={index} x={item.startX + (mirrorHorizontally ? -116 : 120)} y={item.startY - (mirrorVertically ? -65 : 135) + index * 20 + (5 - textLines.length) * 10}>
										{line}
									</tspan>
								)
							})}
						</text>
					</g>
				)
			}))))}
		</svg>
	)
}

export default PatternVisualization
