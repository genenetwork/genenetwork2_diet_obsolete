import sys

import utilities
import datastructure
import genotypes

def get_probesetxref(probesetfreezeid):
    cursor = utilities.get_cursor()
    sql = """
        SELECT ProbeSetXRef.`ProbeSetId`, ProbeSetXRef.`DataId`
        FROM ProbeSetXRef
        WHERE ProbeSetXRef.`ProbeSetFreezeId`=%s
        """
    cursor.execute(sql, (probesetfreezeid))
    return cursor.fetchall()
    
def get_probeset(probesetid):
    cursor = utilities.get_cursor()
    sql = """
        SELECT ProbeSet.`Id`, ProbeSet.`Name`, ProbeSet.`Symbol`, ProbeSet.`description`, ProbeSet.`Probe_Target_Description`, ProbeSet.`Chr`, ProbeSet.`Mb`
        FROM ProbeSet
        WHERE ProbeSet.`Id`=%s
        """
    cursor.execute(sql, (probesetid))
    return cursor.fetchone()
    
def get_probesetdata(probesetdataid):
    cursor = utilities.get_cursor()
    sql = """
        SELECT Strain.`Id`, Strain.`Name`, ProbeSetData.`value`
        FROM ProbeSetData, Strain
        WHERE ProbeSetData.`Id`=%s
        AND ProbeSetData.`StrainId`=Strain.`Id`;
        """
    cursor.execute(sql, (probesetdataid))
    return cursor.fetchall()

def get_probesetxref_probesetfreezeid(locus, probesetfreezeid):
    cursor = utilities.get_cursor()
    sql = """
        SELECT ProbeSetXRef.`ProbeSetId`
        FROM ProbeSetXRef
        WHERE ProbeSetXRef.`ProbeSetFreezeId`=%s
        AND ProbeSetXRef.`Locus` LIKE %s
        """
    cursor.execute(sql, (probesetfreezeid, locus))
    return cursor.fetchall()
    
def get_probesetxref_inbredsetid(locus, inbredsetid):
    cursor = utilities.get_cursor()
    sql = """
        SELECT ProbeSetXRef.`ProbeSetId`, ProbeSetXRef.`mean`, ProbeSetXRef.`LRS`, ProbeSetXRef.`Locus`, ProbeSetXRef.`ProbeSetFreezeId`
        FROM (ProbeSetXRef, ProbeSetFreeze, ProbeFreeze)
        WHERE ProbeSetXRef.`ProbeSetFreezeId`=ProbeSetFreeze.`Id`
        AND ProbeSetFreeze.`ProbeFreezeId`=ProbeFreeze.`Id`
        AND ProbeFreeze.`InbredSetId`=%s
        AND ProbeSetXRef.`Locus` LIKE %s
        """
    cursor.execute(sql, (inbredsetid, locus))
    return cursor.fetchall()

def get_normalized_probeset(locus, inbredsetid):
    normalized_probesets = []
    probesetxrefs = get_probesetxref_inbredsetid(locus, inbredsetid)
    for probesetxref in probesetxrefs:
        normalized_probeset = []
        #
        probesetfreezeid = probesetxref[4]
        probesetfreeze = datastructure.get_probesetfreeze(probesetfreezeid)
        normalized_probeset.append(probesetfreeze[0])
        normalized_probeset.append(probesetfreeze[1])
        normalized_probeset.append(probesetfreeze[2])
        #
        probesetid = probesetxref[0]
        probeset = get_probeset(probesetid)
        normalized_probeset.append(probeset[1])
        normalized_probeset.append(probeset[2])
        normalized_probeset.append(probeset[3])
        normalized_probeset.append(probeset[4])
        normalized_probeset.append(probeset[5])
        normalized_probeset.append(probeset[6])
        #
        normalized_probeset.append(probesetxref[1])
        normalized_probeset.append(probesetxref[2])
        #
        locus = probesetxref[3]
        geno = genotypes.get_geno(inbredsetid=inbredsetid, name=locus)
        normalized_probeset.append(geno[2])
        normalized_probeset.append(geno[3])
        #
        normalized_probesets.append(normalized_probeset)
    return normalized_probesets

locus="rs3663871"
inbredsetid=1

results = get_normalized_probeset(locus=locus, inbredsetid=inbredsetid)
file = open('probesets_%s.txt' % (locus), 'w+')
file.write("GN Dataset ID\t")
file.write("Dataset Full Name\t")
file.write("ProbeSet Name\t")
file.write("Symbol\t")
file.write("ProbeSet Description\t")
file.write("Probe Target Description\t")
file.write("ProbeSet Chr\t")
file.write("ProbeSet Mb\t")
file.write("Mean\t")
file.write("LRS\t")
file.write("Geno Chr\t")
file.write("Geno Mb\t")
file.write("\n")
file.flush()
for row in results:
    file.write("%s\t" % (row[0]))
    file.write("%s\t" % (utilities.clearspaces(row[2], default='')))
    file.write("%s\t" % (utilities.clearspaces(row[3], default='')))
    file.write("%s\t" % (utilities.clearspaces(row[4], default='')))
    file.write("%s\t" % (utilities.clearspaces(row[5], default='')))
    file.write("%s\t" % (utilities.clearspaces(row[6], default='')))
    file.write("%s\t" % (utilities.clearspaces(row[7], default='')))
    file.write("%s\t" % (row[8]))
    file.write("%s\t" % (row[9]))
    file.write("%s\t" % (row[10]))
    file.write("%s\t" % (utilities.clearspaces(row[11], default='')))
    file.write("%s\t" % (row[12]))
    file.write('\n')
    file.flush()
file.close()
