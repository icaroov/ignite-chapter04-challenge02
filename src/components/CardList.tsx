import { useState } from 'react';
import { SimpleGrid, useDisclosure } from '@chakra-ui/react';

import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // DONE => MODAL USEDISCLOSURE
  const { isOpen, onOpen, onClose } = useDisclosure();

  // DONE => SELECTED IMAGE URL STATE
  const [selectedUrl, setSelectedUrl] = useState<string>('');

  // DONE => FUNCTION HANDLE VIEW IMAGE
  function handleViewImage(url: string): void {
    setSelectedUrl(url);
    onOpen();
  }

  return (
    <>
      {/* DONE => CARD GRID */}
      <SimpleGrid columns={3} spacing="40px">
        {cards.map(card => (
          <Card
            key={card.id}
            data={card}
            viewImage={() => handleViewImage(card.url)}
          />
        ))}
      </SimpleGrid>

      {/* DONE => MODALVIEWIMAGE */}
      <ModalViewImage isOpen={isOpen} imgUrl={selectedUrl} onClose={onClose} />
    </>
  );
}
