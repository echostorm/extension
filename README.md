<h1>Welcome!</h1>
<p>NOTE: The demo doesn't currently work as i've closed my firebase account. I'll setup an alternative soon.</p>

![screen shot 2016-05-16 at 08 18 31](https://cloud.githubusercontent.com/assets/4425844/16179331/2b68b3d6-365a-11e6-8ba6-ebc07e56c0f6.png)


<h2>GiveMeCredit is a cryptocurrency where you must earn trust and contribute value in order for money (credits) to be created.</h2>
<h3>Please clone the repo and load the extension into chrome by visiting chrome://extensions/ and then click 'Load unpacked extension'. Then, once enabled, open the index.html file in your browser to see a demo + further instructions.</h3>

<p>If it is installed, you should also see the following widget :-</p>
<p><a href="">http://gmc@0481f1010a5b0147e764aa59741ef923396322e211bb5decf3fbc493821245e6df74494fd11a4bfbb8a594cbd5a31015d8601b748fd34d70dfa20830f33c62be40.com</a></p>

<hr />
GiveMeCredit has three main features:-
<ul>
<li>
A toolbar for rating content
</li>
<li>
A GiveMeCredit widget. You simply paste your link somewhere (i.e. http://gmc@0481f1010a5b0147e764aa59741ef923396322e.com). This is converted into a widget by the extension and allows you to receive credits.
</li>
<li>
A profile-based trust network
</li>
</ul>
<p>So basically, when you rate content, you earn silver credits. And when you donate those silver credits to someone else, they become gold credits. There are lots of rules but here are a few to give you an idea :-</p>
<ul>
<li>The value of a gold credit is relative to the current page score. For example, if your page/content has a score of 75%, then the value of the credit that you receive will be ©0.75.</li>
<li>Silver credits will expire after a set period of time.</li>
</ul>
<p>And to help prevent sybil attacks...</p>

<ul>
<li>You need a profile score of >=3.5 to receive credits (and maybe take into account the scores of those who assigned you that score).</li>
<li>I would like each user to use a custom vanity address that can be checked</li>
<li>I would like it if users could only sync data with other users who have a profile score of >=3.5. If a user is lobbying for credit somewhere, an introduction can be made.</li>
<hr />
<p>I'm currently rebuilding the demo using PouchDB. However, the final implementation will most likely require a blockchain of sorts. I would like the application to function like a social network whereby users only sync data with trusted peers, thus forming a trust network. A trusted peer is a user who has a positive feedback score of 3.5 stars or above (out of 5 stars). You could also check that the users who have provided the feedback have 3.5 stars and above. Of course, this alone is not sufficient in preventing sybil attacks (i.e. users creating lots of fake profiles). However, if it is required that users have a custom 'vanity' address that can be checked (i.e. the first x characters match the last x characters), then it will take time for a user to create an account.</p><p>I'm interested in using CouchDB as a database. A CouchDB database can replicate data to other peers, and the integrity of that data can be verified inside the database itself.</p><p>
As also mentioned, i'd like silver credits to expire. There will also be a limit on how many silver credits a person can hold at any one time and a limit to how many silver credits that can be earned in a given timeframe. This would make sense since silver credits are not meant to have any value. They are used to assign value to items and to impose an extra layer of disipline to the money creation process. Also, the data provided by rating content could be very useful for developing a search engine. By allowing silver credits to expire it ensures a turnover of fresh content, thus preventing monopolies. 
</p>
</ul>
<hr />
<h4>STEP 1:</h4>
<p>Click on the icon (top right) and register.</p>
<p>The registration process simply generates a pair of keys (similar to a username and password). You will need to provide a url to your profile picture. I have pre-populated the form for testing purposes.</p>

<h4>STEP 2:</h4>
<p>Login</p>

<h4>STEP 3:</h4>
<p>Click on the profile picture on the toolbar and edit your info. For testing purposes, give yourself a comment also.</p>


<h4>STEP 4:</h4>

<p>Earn a Silver Credit by rating this page using the toolbar below.</p>
<p>You can check the console to see the verification process. Each time you do anything such as setup an account, vote or give credit to someone, a new signature is created. However, for transactions, this signature will be the transactionID. I did it this way in order to reduce the transaction size. It may take a few seconds to create the signature. It's sort of like a 'proof-of-work' as it must find a signature where the last x number of characters must match the first x number of characters.</p>


<h4>STEP 5:</h4>

<p>Give someone credit. For testing purposes, setup a new account but don't login! Instead copy the public key from the login form, go to the index.html file and paste the public key i.e. http://gmc@[paste here].com. You can now give credit from your logged in account to the new account.</p>
<p>NOTE: You can use the following url for the profile picture :- https://openmerchantaccount.com/img2/WDF_1048452.jpg</p>
<p>NOTE: Profile images must be served over https. You can upload an image to:- httpsimage.com if you want</p>


<h4>STEP 6:</h4>

<p>Ask other users to give you a profile reference. This is not necessary for testing puposes. However, once the app is in production, you will need a profile score of >= 3.5. Also, you will need at least 3 references in order to be given Gold Credits. And each reference must have a profile score of >= 3.5. This is 1 level deep. As the network grows, this will drop to 2 levels deep. By that i mean you will need 3 references with a score of >= 3.5, and those 3 references will each need 3 references of >= 3.5. It could go deeper still. The whole point is to ensure that users cannot create a network of accounts and give themselves credits.</p>

<h4>STEP 7:</h4>
<p>Copy your profile link (given to you after registration) and paste it next to something you want credit for.</p>


<h4>STEP 8:</h4>
<p>Ask people to give you credit!</p>
