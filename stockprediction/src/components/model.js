import * as tf from '@tensorflow/tfjs';


export const train = async (input, epochs, batch_size, n_input, callback) => {
    // data{x: Date, y: Price} = input data
    var x_train = [];
    var y_train = [];
    input.reverse();
    var train = input.map(item => item.y).slice(0, input.length-n_input)
    
    let max = Math.max(...train);
    for(let i = n_input; i < train.length; i++){
        x_train.push(train.slice(i-n_input, i));
        y_train.push(train[i]);
    }
    x_train = tf.reshape(x_train, [x_train.length, x_train[0].length, 1]).div(tf.scalar(max));
    y_train = tf.tensor1d(y_train).div(tf.scalar(max));
    
    
    

    const model = tf.sequential();
    model.add(tf.layers.lstm({units: 200, activation: 'relu', returnSequences: true, inputShape: [x_train.length, 1]}))
    model.add(tf.layers.dropout({rate: 0.1}))
    console.log('done first layer');
    model.add(tf.layers.lstm({units: 200, activation: 'relu', returnSequences: true}))
    model.add(tf.layers.dropout({rate: 0.1}))
    console.log('done second layer');
    model.add(tf.layers.lstm({units: 50, activation: 'relu'}))
    model.add(tf.layers.dropout({rate: 0.2}))
    console.log('done third layer');
    model.add(tf.layers.dense({units: 1}))
    model.compile({
        optimizer: 'adam',
        loss: 'meanSquaredError'
    })

    const hist = await model.fit(x_train, y_train, {
        batchsize: batch_size,
         epochs: epochs,
         callbacks: {
             onEpochEnd: (epoch, log) => {callback(epoch, log)}
         }
        })
    console.log('done training!')
    var test = input.map(item => item.y).slice(input.length-n_input, input.length);
    var x_test = tf.reshape(test, [1, test.length, 1]).div(tf.scalar(max))
    
    
    var foo;
    
    const predict = [];
    for(let i = 0; i < n_input; i++){ 
        
        predict.push(model.predict(x_test).dataSync()[0]);
        console.log(model.predict(x_test).dataSync().length)
        x_test = x_test.slice([0,1,0], [1, -1, 1])
      
        foo = tf.tensor3d([predict[i]], [1,1,1])
        x_test = tf.concat([x_test, foo], 1);
       
        
        
    }
    //tf.reshape(x_train, [y_train.length, n_input]);
    
    
    console.log(predict)
    
    return {price: predict.map(item => item * max), hist: hist};

  }