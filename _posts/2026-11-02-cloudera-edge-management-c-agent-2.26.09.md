---
title:  "Cloudera Edge Management C++ Agent 2.26.09"
header:
  teaser: "/assets/images/cloudera_ai_inference.png"
categories:
  - release
tags:
  - cloudera
  - edge-management
  - minifi-cpp
  - ai-inference
---

The Data in Motion Team is pleased to announce the General Availability (GA) release of Cloudera Edge Management C++ Agent 2.26.09. This release offers new features and improvements as well as upgraded dependencies, which extend local AI inference capabilities at the edge.

## Release Highlights

1. **TractModelService controller service (Technical Preview):** This controller service enables the user to provide a CPU-optimized neural network for inference, supporting ONNX (`.onnx`) and NNEF (directory or tarball) models.
2. **Object detection processor (Technical Preview):** The DetectObject processor, which leverages the new TractModelService controller service, allows users to use an object detection model to infer the locations of individual objects in an input image.
3. **DrawBoundingBoxes processor (Technical Preview):** This processor, paired with an upstream DetectObject processor, allows the user to visualise object detections in an incoming image by drawing bounding boxes around the objects in the original image.
4. **Image classification processor (Technical Preview):** The ClassifyImage processor allows users to leverage any image classification model to produce metadata and confidence scores, accurately identifying a particular object in an input image.
5. **EncryptContentPGP and DecryptContentPGP available:** The EncryptContentPGP and DecryptContentPGP processors have been ported to C++ for users of the Cloudera Edge Management C++ Agent.
6. **Support for newer Operating Systems:** The CEM C++ Agent has been validated on RHEL 10, Debian 13 and Ubuntu 26.04, removing support for Debian 11 and Ubuntu 20.04, continuing our commitment to support recent Operating System releases.
7. **S3 write performance enhanced:** The PutS3Object processor can now reach 250 MB/s upload speed.

## Links

- [Release notes](https://docs.cloudera.com/cem/2.4.0/release-notes-minifi-cpp/topics/cem-minifi-cpp-agent-updates.html)
- [Download](https://docs.cloudera.com/cem/2.4.0/release-notes-minifi-cpp/topics/cem-minifi-cpp-download-locations.html)
- [Edge to AI for Dummies eBook](https://www.cloudera.com/content/dam/www/marketing/resources/ebooks/edge-to-ai-for-dummies.pdf.landing.html)

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
