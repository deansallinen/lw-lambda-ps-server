This simple function takes an elementID from Flex Rental Solutions for a given Pull Sheet and returns a PDF of that Pull Sheet without the user needing to be logged in. 

This allows our road crew to download and view digital copies of their paperwork on demand, on mobile, without needing credentials (or Flash to run Flex).

The function generates the Pull Sheet using an unprivileged account. ElementIDs are UUIDs and are not susceptible to guessing.