import React from 'react'
import { View, Text, TouchableOpacity } from "react-native"
import Carousel, { Pagination } from 'react-native-snap-carousel'
import CarouselCardItem, { SLIDER_WIDTH, ITEM_WIDTH } from './CarouselCardItem'
import data from './data'

const CarouselCards = () => {
  const [index, setIndex] = React.useState(0)
  const isCarousel = React.useRef(null)

  return (
    <View>

       {/* Header Section */}
       <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Adopt Pet</Text>
        <TouchableOpacity onPress={() => console.log('See All pressed')}>
          <Text style={{ color: 'blue', fontSize: 16 }}>See All</Text>
        </TouchableOpacity>
      </View>

      <Carousel

        ref={isCarousel}
        data={data}
        renderItem={CarouselCardItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        onSnapToItem={(index) => setIndex(index)}
        useScrollView={true}
        
      />
    </View>
  )
}

export default CarouselCards