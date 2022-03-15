# GALAXIATORS CODEX
This code has been ported over from a private repo as an example of my work - RD

## Description
Galaxiators is an upcoming NFT game powered by the ImmutableX L2 Ethereum solution.

The community was looking for a way to view and filter Galaxiators created as part of an ongoing minting process, so I created this Codex.

This was a solo project; I was the only dev and designer. This work led to me being recruited into the core Galaxiators team. 

## Tech Stack
* **Frontend**: Vue3
* **APIs**: ImmutableX

## Status

Currently active on https://codex.galaxiators.com/

(It can be quite slow to load due to pulling data direct from ImmutableX and large images from geographically distant GCP buckets. I've tried to limit concurrent downloads with a 'Show More' button, but without a CDN this remains a problem.)