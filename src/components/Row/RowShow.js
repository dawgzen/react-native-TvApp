import React, { Fragment } from "react";
import axios from "axios";
import {
  View,
  ScrollView,
  SafeAreaView,
  FlatList,
  Text,
  Platform,
  ActivityIndicator
} from "react-native";

import Card from "./Card/CardShow";

import styles from "./row.scss";

/**
 * @async
 * @param {string} link the id for the link.
 * @returns the Id of the video.
 *
 * @author Tim Twiest
 * @version 0.0.1
 * @since 0.0.1
 */
const getId = link => {
  return link.split("/c/")[1].replace(".js", "");
};

export default class RowShow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      cache: []
    };

    this.onScroll = this.onScroll.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  onScroll = () => {
    // console.log("#onScroll");
  };

  fetchData = () => {
    const showUrl = `https://sportnoord.nl/wp-json/wp/v2/sn-show?page=1&per_page=15`;

    axios
      .get(showUrl)
      .then(res => {
        const cache = res.data;
        const data = [];

        cache.forEach(element => {
          let video = {
            id: element.id,
            title: element.title.rendered,
            type: element.show[0].name,
            image: element.featured_image.medium_large,
            videoId: getId(element.videos.video),
            // date: element.match_dates.start,
            videoUrl: `https://ndc.bbvms.com/mediaclip/${getId(
              element.videos.video
            )}/redirect/MP4_HD`
          };

          data.push(video);
        });

        this.setState({
          cache: data,
          isLoading: false
        });
      })
      .catch(error => {
        if (error.response) {
          console.log(error.responderEnd);
        }
      });
  };

  componentDidMount() {
    this.fetchData();
  }

  render() {
    const { isLoading, cache } = this.state;

    const Content = () => {
      return isLoading ? (
        <ActivityIndicator
          style={styles.activityContainer}
          size="large"
          color="#E62341"
        />
      ) : (
        cache.map(child => (
          <CardShow
            key={child.id}
            id={child.id}
            title={child.title}
            type={child.type}
            image={child.image}
            videoId={child.videoId}
            // date={child.date} //!
            videoUrl={child.videoUrl}
          />
        ))
      );
    };

    return (
      <>
        <SafeAreaView style={styles.rowContainer}>
          <Text style={styles.categoryTitle}>SHOWS</Text>
          {isLoading ? (
            <ActivityIndicator
              style={styles.activityWrapper}
              size="large"
              color="#E62341"
            />
          ) : (
            <FlatList
              horizontal
              data={cache}
              renderItem={({ item }) => (
                <Card
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  type={item.type}
                  image={item.image}
                  videoId={item.videoId}
                  date={item.date}
                  videoUrl={item.videoUrl}
                />
              )}
              keyExtractor={item => item.id}
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="on-drag"
            />
          )}
        </SafeAreaView>
      </>
    );
  }
}
