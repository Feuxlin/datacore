import React, { PureComponent } from 'react';
import { Header, Popup, Modal, Grid, Icon } from 'semantic-ui-react';

import ItemDisplay from '../components/itemdisplay';
import ItemSources from '../components/itemsources';

import { calculateCrewDemands } from '../utils/equipment';
import CONFIG from '../components/CONFIG';

type CrewFullEquipTreeProps = {
	visible: boolean;
	crew: any;
	onClosed: any;
	items: any[];
};

class CrewFullEquipTree extends PureComponent<CrewFullEquipTreeProps> {
	render() {
		const { crew, items } = this.props;

		if (!crew || !this.props.visible) {
			return <span />;
		}

		let { craftCost, demands, factionOnlyTotal, totalChronCost } = calculateCrewDemands(crew, items);

		return (
			<Modal open={this.props.visible} onClose={() => this.props.onClosed()}>
				<Modal.Header>{crew.name}'s expanded equipment recipe trees</Modal.Header>
				<Modal.Content scrolling>
					<p>
						Faction-only items required <b>{factionOnlyTotal}</b>
					</p>
					<p>
						Estimated chroniton cost{' '}
						<span style={{ display: 'inline-block' }}>
							<img src={`/media/icons/energy_icon.png`} height={14} />
						</span>{' '}
						<b>{totalChronCost}</b>
						<Popup
							wide
							trigger={<Icon fitted name='help' />}
							header={'How is this calculated?'}
							content={
								<div>
									<p>This sums the estimated chroniton cost of each equipment and component in the tree.</p>
									<p>It estimates an item's cost by running the formula below for each mission and choosing the cheapest:</p>
									<p>
										<code>
											(6 - PIPS) * 1.8 * <i>mission cost</i>
										</code>
									</p>
									<p>See code for details. Feedback is welcome!</p>
								</div>
							}
						/>
					</p>
					<p>
						Build cost{' '}
						<span style={{ display: 'inline-block' }}>
							<img src={`/media/icons/images_currency_sc_currency_0.png`} height={16} />
						</span>{' '}
						<b>{craftCost}</b>
					</p>
					<Grid columns={3} centered padded>
						{demands.map((entry, idx) => (
							<Grid.Column key={idx}>
								<Popup
									trigger={
										<Header
											style={{ display: 'flex', cursor: 'zoom-in' }}
											icon={
												<ItemDisplay
													src={`/media/assets/${entry.equipment.imageUrl}`}
													size={48}
													maxRarity={entry.equipment.rarity}
													rarity={entry.equipment.rarity}
												/>
											}
											content={entry.equipment.name}
											subheader={`Need ${entry.count} ${entry.factionOnly ? ' (FACTION)' : ''}`}
										/>
									}
									header={CONFIG.RARITIES[entry.equipment.rarity].name + ' ' + entry.equipment.name}
									content={<ItemSources item_sources={entry.equipment.item_sources} />}
									on='click'
									wide
								/>
							</Grid.Column>
						))}
					</Grid>
				</Modal.Content>
			</Modal>
		);
	}
}

export default CrewFullEquipTree;
