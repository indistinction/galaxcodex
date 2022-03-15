<template>
  <div>
    <h2>Rarity Calculations</h2>
    <p>Rarity is calculated as follows. This is an ongoing process and still under development, but it was deemed to be worth getting an initial idea out to the community. If you'd like to make a suggestion ping/DM Gompy on the Discord.</p>
    <p>First point to note is that Race is excluded from Rarity calculations at the minute. This is to allow fair comparisons between Races as minting is ongoing, but will be reintroduced once minting has finished.</p>
    <p>Title is also excluded from the main Rarity calculation. It is dealt with separately, as we'll see later. All other traits contribute to the Rarity score equally.</p>
    <p>The main Rarity calulation is...</p>
    <code>
      Trait_Rarity_Score = 10 &times; (1-(Trait_Count / Total_Galaxiators))
    </code>
    <p>This means that if a Galaxiator has a common trait shared by 65% of all Galaxiators, they would receive 3.5 trait points for that trait.</p>
    <p>On the other hand, if a Galaxiator has a ultra rare trait that only 0.2% of the population share, they will be awarded 9.98 points for this trait.</p>
    <p>The base Rarity score for a Galaxiator is the sum of all of their Trait Rarity scores.</p>
    <p>As you can see there is no recognition of any 'synergy' sets of multiple pieces so far, and the only measure of that from raw data is the Title.</p>
    <p>To account for special sets any Galaxiator with a Title has their base Rarity multiplied by a factor of 1.75.</p>
    <p>To make the obvious 'low' Rarities more obvious, the lowest recorded Rarity is then subtracted from all Rarities. As an example this means that instead of a Rarity range between 78 and 192 we end up of a range between 1 and 115.</p>
    <h2>Looking forwards...</h2>
    <p>The benefits of the system as it is are that multiple different Traits can be combined into a single Rarity indicator, and all Traits are treated equally.
      However, no system like this was going to please everybody, and as it stands this is an imperfect and pretty 'blunt' tool.</p>
    <p>Suggestions for the future include weighting traits differently (so background color might be weighted lower than shield or weapon, for example), which I see as a great step.
      All traits should contribute to Rarity scores, but some definitely more than others.</p>
    <p>Another quick fix is dealing with sets/Titles. As it stands two-item and three-item sets are treated the same, and this definitely shouldn't be the case. Rest assured Rarity will be updated to reflect this soon.</p>
    <p>Thanks for reading, please reach out to Gompy with any suggestions.</p>
  </div>
</template>

<script>
export default {
  name: "Calcs"
}
</script>

<style scoped>

</style>