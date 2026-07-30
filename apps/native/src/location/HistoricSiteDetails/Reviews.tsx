import {View, Text, Image} from 'react-native';
import {styles} from '~/location/HistoricSiteDetails/styles';
import {Spinner} from '~/layout/Layout/components/Spinner';
import { HistoricSiteType } from '@northernexplorer/types';

type ReviewDetailsProps = {
  data: HistoricSiteType ;
  loading:boolean;
  error:Error|null;
};


export function ReviewDetails({data,loading,error}:ReviewDetailsProps) {

  
 console.log(JSON.stringify(data.reviews, null, 2));
    if (loading) return <Spinner />;

    if (error || !data) {
        return <Text style={styles.errorText}>{error?.message || 'Reviews could not be found.'}</Text>;
    } 

    if(data.reviews?.length === 0){
      return <Text style={styles.errorText}>No Reviews yet...</Text>
    }

    return (
      <>
        
        <View style={styles.reviewCard}>
              {data.reviews?.map(review => (
  <View key={review.id}>
    <Text style={styles.title}>{review.rating}</Text>
    <Text style={styles.userName}>{review.user.username}</Text>
     <Text style={styles.score}>user score:{review.user.score}</Text>
    <Text style={styles.description}>{review.description}</Text>
  </View>
))}
        </View>
        </>
    )

}