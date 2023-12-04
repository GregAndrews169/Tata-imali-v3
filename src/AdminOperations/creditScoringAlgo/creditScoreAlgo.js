import * as tf from '@tensorflow/tfjs';
import Creditdata from './MockCreditScoreData.json';

// Prepare features and target variables
const trainFeatures = Creditdata.map(entry => [
  entry["Airtime Used"],
  entry["Data Used"],
  entry["Avg Airtime Top-Up"],
  entry["Avg Data Top-Up"],
  entry["Txn Volume (Momo)"],
  entry["Avg Top-Up (Momo)"],
  entry["Age"]
]);
const trainTargets = Creditdata.map(entry => entry["Actual Credit Score"]);

// Convert the trainFeatures array to a TensorFlow tensor
const trainFeaturesTensor = tf.tensor2d(trainFeatures);

// Convert the trainTargets array to a TensorFlow tensor
const trainTargetsTensor = tf.tensor1d(trainTargets);

// Build the random forest model with hyperparameter tuning
const randomForestModel = tf.sequential();
randomForestModel.add(tf.layers.dense({
  units: 64,
  activation: 'relu',
  inputShape: [trainFeatures[0].length],
  kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
}));
randomForestModel.add(tf.layers.dense({ units: 1, activation: 'linear' }));
randomForestModel.compile({ optimizer: tf.train.adam(0.001), loss: 'meanSquaredError' });

// Train the random forest model
(async () => {
  await randomForestModel.fit(trainFeaturesTensor, trainTargetsTensor, { epochs: 100, validationSplit: 0.2, shuffle: true });
  console.log('Random Forest Model trained');
})();

// Function to predict credit score using the trained random forest model
export const randomForestCreditScoreModel = {
  predict: (newData) => {
    const newFeatures = newData.map(entry => [
      entry["Airtime Used"],
      entry["Data Used"],
      entry["Avg Airtime Top-Up"],
      entry["Avg Data Top-Up"],
      entry["Txn Volume (Momo)"],
      entry["Avg Top-Up (Momo)"],
      entry["Age"]
    ]);
    const newFeaturesTensor = tf.tensor2d(newFeatures);
    const predictedScoreTensor = randomForestModel.predict(newFeaturesTensor);
    const predictedScores = predictedScoreTensor.arraySync();

    return predictedScores;
  },
};
